export const initialState = {
    loading: true,
    error: false,
    noData: false,
    reload: false,
};

export type State = {
    loading: boolean;
    error: any;
    noData: boolean;
    reload: boolean;
}

export type Action = {
    type: string;
    payload?: any;
}

export const actions = {
    LOADING: `loading`,
    ERROR: `error`,
    NODATA: `noData`,
    RELOAD: `reload`,
    CLEANUP: `cleanup`,
};

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
    case actions.LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case actions.ERROR:
        return {
            ...state,
            error: action.payload,
        };
    case actions.NODATA:
        return {
            ...state,
            noData: true,
        };
    case actions.RELOAD:
        return {
            ...state,
            reload: !state.reload,
        };
    case actions.CLEANUP:
        return {
            ...initialState,
        };
    default:
        return state;
    }
};
