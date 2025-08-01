import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation,useNavigate} from "react-router";

export const meta =()=>([
    {title:'Resumind | Auth'},
    {name:'description',content:'log into your account'},

])
import react from "react";
const Auth = () =>{
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return(
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center ">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col bg-white gap-8 pd-10 rounded-2xl">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue your job journey</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in....</p>
                            </button>
                        ):(
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                ):(
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log in</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Auth