const Reducer = (state, action) => {
    switch (action.type) {
        case "LANG": 
            return {
                ...state,
                lang: action.payland?.lang,
            };
            
        default:
            return state;
    }
};

export default Reducer;
