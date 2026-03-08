import { writable, type Writable } from "svelte/store";
import { Logger } from "$lib/scripts/Logger.ts";

type AccountType = {
    _id: string,
        
    username: string,
    password?: string,

    uploads: {
        files: string[],
        storageUsed: number,
        storageMax: number
    },
    settings: {
        embeds: {
            enabled: boolean,
            title: string,
            description: string,
            siteName: string,
            color: string
        },
        rawUrl: boolean,
        domain: string,
        subDomain: string,
    }

    admin: boolean,

    createdAt: number,
}

type AuthStateType = {
    loggedIn: boolean,
    loading: boolean,
    error?: string,
    rateLimited?: boolean,
    auto?: string //remote, local
}

type SettingPushStateType = {
    loading: boolean,
    ok: boolean | null,
    error?: string,
    resetId?: number
}

export type { AccountType, AuthStateType, SettingPushStateType };



const Account: Writable<null | AccountType> = writable<null | AccountType>(null);
const AuthState: Writable<AuthStateType> = writable<AuthStateType>({loggedIn: false, loading: true});
const AuthLogger = new Logger("Auth");

const SettingPushState: Writable<SettingPushStateType> = writable({loading: false, ok: null});

export { Account, AuthState, AuthLogger, SettingPushState };



async function LogIn(username: string, password: string): Promise<AuthStateType> {
    if (!username || !password) {
        const res = {loggedIn: false, loading: false, error: "Missing fields"}
        
        AuthState.set(res);
        return res
    }

    try {
        AuthState.set({loggedIn: false, loading: true});

        const r = await fetch(`/api/v2/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })

        //if the request failed
        if (!r.ok) {
            const e = await r.json();
            const res = {
                loggedIn: false,
                loading: false,
                error: e.error || "Unknown error",
                rateLimited: r.status === 429
            }

            AuthState.set(res);
            return res;
        }

        const data = await r.json();
        const session = data?.session;

        if (!session) {
            const res = {
                loggedIn: false,
                loading: false,
                error: "Unable to get session token"
            }
            AuthState.set(res);
            return res;
        }

        document.cookie = `session=${session}; path=/`;

        const res = await Authenticate();
        
        AuthState.set(res.state);
        return res.state;
    } catch (e) {
        const res = {loggedIn: false, loading: false, error: `${e}`}
        AuthState.set(res);
        return res;
    }
}

async function Register(username: string, password: string, invite: string): Promise<AuthStateType> {
    if (!invite || !username || !password) {
        const res = {loggedIn: false, loading: false, error: "Missing fields"}
        
        AuthState.set(res);
        return res
    }

    try {
        AuthState.set({loggedIn: false, loading: true});

        const r = await fetch(`/api/v2/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password, invite})
        })

        //if the request failed
        if (!r.ok) {
            const e = await r.json();
            const res = {
                loggedIn: false,
                loading: false,
                error: e.error || "Unknown error",
                rateLimited: r.status === 429
            }

            AuthState.set(res);
            return res;
        }

        const data = await r.json();
        const session = data?.session;

        if (!session) {
            const res = {
                loggedIn: false,
                loading: false,
                error: "Unable to get session token"
            }
            AuthState.set(res);
            return res;
        }

        document.cookie = `session=${session}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`; //in 7 days

        const res = await Authenticate();

        AuthState.set(res.state);
        return res.state;

    } catch (e) {
        const res = {loggedIn: false, loading: false, error: `${e}`}
        AuthState.set(res);
        return res;
    }
}

async function Authenticate(silent?: boolean): Promise<{state: AuthStateType, account?: AccountType}> {
    if (!silent) { AuthState.set({loggedIn: false, loading: true}); }

    const r = await fetch(`/api/v2/auth/verify`, {
        method: "POST",
    })

    //if the request failed
    if (!r.ok) {
        const res = {
            loggedIn: false,
            loading: false,
            error: "Session expired"
        }
        AuthState.set(res);
        return {state: res};
    }

    const account = await r.json() as AccountType;

    if (!account) {
        const res = {
            loggedIn: false,
            loading: false,
            error: "Unable to get account data"
        }
        AuthState.set(res);
        return {state: res};
    }

    Account.set(account);
    localStorage.setItem("account.data", JSON.stringify(account));
    localStorage.setItem("account.expire", (Date.now() + 1000 * 60 * 5).toString()); //update account data every 5 minutes

    const res = {
        loggedIn: true,
        loading: false,
        auto: "remote"
    }
    AuthState.set(res);
    return {state: res, account: account};
}

async function AutoAuthenticate(): Promise<{state: AuthStateType, account?: AccountType}> {
    AuthState.set({loggedIn: false, loading: true});

    //check if the session cookie exists
    const cookies = document.cookie.split("; ");
    const session = cookies.find(c => c.startsWith("session="))?.split("=")[1];
    if (!session) {
        const res = {loggedIn: false, loading: false};

        AuthState.set(res);
        return {state: res};
    }

    let localExpire = localStorage.getItem("account.expire");
    if (!localExpire || parseInt(localExpire) < Date.now() && parseInt(localExpire) !== -1) { //load remote content
        const res = await Authenticate();
        if (!res.state.loggedIn) { localStorage.setItem("account.expire", "-1"); } //disable auto auth

        AuthState.set(res.state);
        return res;
    }

    if (localExpire && parseInt(localExpire) === -1) { //disable auto auth
        const res = {loggedIn: false, loading: false};

        AuthState.set(res);
        return {state: res};
    }

    if (localExpire && parseInt(localExpire) > Date.now()) { //auth successful - load local content
        const res = {loggedIn: true, loading: false, auto: "local"}
        const acc = JSON.parse(localStorage.getItem("account.data") as string) as AccountType;

        Account.set(acc);
        AuthState.set(res);
        return {state: res, account: acc };
    }

    //auth with the server
    const res: {state: AuthStateType, account?: AccountType} = await Authenticate();

    return res;
}

async function LogOut(): Promise<AuthStateType> {
    AuthState.set({loggedIn: false, loading: true});

    try {
        let localExpire = localStorage.getItem("account.expire");
        if (localExpire && parseInt(localExpire) > Date.now()) { //this means the account is still valid
            const r = await fetch(`/api/v2/auth/logout`, {
                method: "POST"
            })
        }

        localStorage.removeItem("account.data");
        localStorage.removeItem("account.expire");
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        const res = {loggedIn: false, loading: false}
        AuthState.set(res);
        Account.set(null);

        return res;

    } catch (e) {
        const res = {loggedIn: false, loading: false, error: `${e}`}
        AuthState.set(res);
        return res;
    }
}

function resetPushState() {
    const resetId = Math.random();
    SettingPushState.update(s => {
        return {
            loading: s.loading,
            ok: s.ok,
            error: s.error,
            resetId: resetId
        }
    })

    setTimeout(() => {
        SettingPushState.update(s => {
            if (s.resetId === resetId) {
                return {
                    loading: false,
                    ok: null
                }
            }
            return s;
        })   
    }, 5000)
}

async function PushSettings(options: {[key: string]: any}): Promise<{ok: boolean, error?: {message: string, retryParams: {[key: string]: any}}}> {
    try {
        SettingPushState.set({loading: true, ok: null});

        const r = await fetch(`/api/v2/config/push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                settings: options
            })
        })

        const data = await r.json();
        if (!r.ok) {
            SettingPushState.set({loading: false, ok: false, error: data.error || "Unknown error"});
            resetPushState();
            
            return {
                ok: false,
                error: {
                    message: data.error || "Unknown error",
                    retryParams: options
                }
            }
        }

        //update the local account data
        let acc = JSON.parse(localStorage.getItem("account.data") as string) as AccountType;
        acc.settings = data.settings;
        localStorage.setItem("account.data", JSON.stringify(acc));

        Account.set(acc);
        SettingPushState.set({loading: false, ok: true});
        resetPushState();

        return {ok: true}
    } catch (e) {
        SettingPushState.set({loading: false, ok: false, error: `${e}`});
        resetPushState();

        return {
            ok: false,
            error: {
                message: `${e}`,
                retryParams: options
            }
        }
    }
}

export {
    LogIn,
    LogOut,
    Register,
    Authenticate,
    AutoAuthenticate,

    PushSettings
}