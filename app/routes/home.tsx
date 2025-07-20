import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import {callback} from "fdir/dist/api/async";
import {usePuterStore} from "~/puter";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import ResumeCard from "~/components/ResumeCard";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resuming" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth} = usePuterStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])
  // @ts-ignore
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center ">
    <section className="main-section">
      <Navbar/>
      <div className="page-heading py-16">
        <h1>Track your Application and resume ratings</h1>
        <h2>Review your submission and check AI-powered feedback</h2>
      </div>
    {resumes.length > 0 &&(
        <div className="resumes-section">
          {resumes.map((resume)=>(
              <ResumeCard key={resume.id} resume={resume}/>
          ))}
        </div>
    )}
    </section>
  </main>
}
