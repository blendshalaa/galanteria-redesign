const Reducer = (state, action) => {
    switch (action.type) {
        case "LANG":
            // This previously read `action.payland?.lang` — a typo for
            // `payload`. Any dispatcher sending the correctly-spelled key set
            // `lang` to undefined, which is why so much of the codebase guards
            // every lookup with `language[lang]?.…`.
            return {
                ...state,
                lang: action.payload?.lang ?? action.payland?.lang ?? state.lang,
            };

        default:
            return state;
    }
};

export default Reducer;
