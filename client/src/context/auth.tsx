import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../type";
import axios from "axios";

interface State {
    authenticated: boolean;
    user: User | undefined;
    loading: boolean;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true
})

// state 업데이트하기 위해
const DispatchContext = createContext<any>(null);

interface Action {
    type: string;
    payload: any;
}

const reducer = (state: State, {type, payload}: Action) => {
    switch(type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload
            } 
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }   
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }   
        default:
            throw new Error(`Unknown action type: ${type}`);        
    }
}

// Context의 state를 사용하기 위해 StateContext로 감싸줘야함
// 따로 함수를 만들어서 사용하는 방법
export const AuthProvider = ({children}:{children: React.ReactNode}) => { // 객체 전체가 아닌 children의 타입이 React.ReactNode임을 지정
    
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true
    });

    
    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({type, payload});
    }

    // 로그인 후에는 로그인 페이지, 회원가입 페이지에 들어가도 다시 메인 페이지로 돌아가게
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/auth/me");
                dispatch("LOGIN", res.data);
            } catch (error) {
                console.log(error);
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        loadUser();
    },[])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);