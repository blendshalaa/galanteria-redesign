import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from './ContactForm';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

/**
 * The real submit path posts to Supabase (`supabase.from('inquiries')
 * .insert(...)`), which has no business running in a unit test. Mocking the
 * client at the module level is what lets `handleSubmit` run for real while
 * that one call resolves to a canned, successful result.
 */
const insertMock = vi.fn(() => Promise.resolve({ error: null }));
vi.mock('@/lib/supabase/client', () => ({
  supabase: { from: () => ({ insert: insertMock }) },
}));

function renderForm(props) {
  return render(
    <LanguageProvider initialLang="en">
      <ContactForm {...props} />
    </LanguageProvider>
  );
}

/**
 * The form treats a submission inside MIN_SECONDS_ON_FORM (3s of the form
 * being mounted) as a bot and silently reports success without validating
 * or inserting anything — see ContactForm.jsx's `mountedAt` ref. Every test
 * below that needs validation or the real submit path to actually run spies
 * on `Date.now` instead of waiting out 3 real seconds per test: one low
 * reading for the mount timestamp, a far later one for every check after.
 */
function clearHoneypotWindow() {
  const dateNowSpy = vi.spyOn(Date, 'now');
  dateNowSpy.mockReturnValueOnce(0);
  dateNowSpy.mockReturnValue(10_000);
  return dateNowSpy;
}

describe('ContactForm validation', () => {
  beforeEach(() => {
    insertMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects a name shorter than 3 characters', async () => {
    clearHoneypotWindow();
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'Jo');
    await user.type(screen.getByLabelText(/email/i), 'jo@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/at least 3/i)).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects a message shorter than 10 characters', async () => {
    clearHoneypotWindow();
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'Visitor Name');
    await user.type(screen.getByLabelText(/email/i), 'visitor@example.com');
    await user.type(screen.getByLabelText(/message/i), 'too short');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/at least 10/i)).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed email address', async () => {
    clearHoneypotWindow();
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'Visitor Name');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/message/i), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/does not look right/i)).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects a phone number with fewer than 9 digits, but only when phone is filled in', async () => {
    clearHoneypotWindow();
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'Visitor Name');
    await user.type(screen.getByLabelText(/email/i), 'visitor@example.com');
    await user.type(screen.getByLabelText(/phone/i), '12345');
    await user.type(screen.getByLabelText(/message/i), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/at least 9 digits/i)).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('strips digits typed into the name field rather than accepting and complaining later', async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'Anna123');

    expect(nameInput).toHaveValue('Anna');
  });

  it('strips letters typed into the phone field', async () => {
    const user = userEvent.setup();
    renderForm();

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, 'abc044123456');

    expect(phoneInput).toHaveValue('044123456');
  });

  it('submits successfully once every field is valid', async () => {
    clearHoneypotWindow();
    const user = userEvent.setup();
    renderForm({ productSlug: 'moet', productName: 'Moet' });

    await user.type(screen.getByLabelText(/name/i), 'Visitor Name');
    await user.type(screen.getByLabelText(/email/i), 'visitor@example.com');
    await user.type(screen.getByLabelText(/message/i), 'I would like a quote, please.');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));

    const [row] = insertMock.mock.calls[0][0];
    expect(row).toMatchObject({
      name: 'Visitor Name',
      email: 'visitor@example.com',
      product_slug: 'moet',
      product_name: 'Moet',
    });
  });
});
