import React, {type FormEvent} from "react";
import {useState} from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import { useNavigate } from 'react-router';
import {formatSize} from "~/lib/utils";

const Upload = ()=>{
    const navigate = useNavigate();
    const {auth,isLoading,fs,kv,ai} = usePuterStore();
    const[isProcessing, setIsProcessing] = useState(false);
    const[statusText, setStatusText] = useState('');
    const [File, setFile] = useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleAnalyze = async ({companyName,jobTitle,jobDescription,File}:{companyName:string,jobTitle:string,jobDescription:string,File:File}) =>{
        setIsProcessing(true);
        setStatusText('Uploading the file');
        const uploadedFile = await fs.upload([File]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload the file');
        setStatusText('Converting into image...');
        const imageFile = await convertPdfToImage(File);
        if(!imageFile.file) return setStatusText('Error: Failed to convert pdf to image');
        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload the Image');

        setStatusText('Preparing image...');
        const uuid = await generateUUID();

        const data = {
            id: uuid,
            resumePath:uploadedFile.path,
            imagePath:uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback : '',
        }
        await kv.set(`resume ${uuid}`,JSON.stringify(data));
        setStatusText('Analyzing....');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription})
        )
        if (!feedback) return setStatusText('Error:Failed to analyze resume');
        const feedbackText = typeof feedback.message.content === 'string'?feedback.message.content: feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume ${uuid}`,JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;
        if(!File) return;
        handleAnalyze({companyName, jobTitle, jobDescription,File});

    }
    return(
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                            src="/images/resume-scan.gif" className="w-full"/>
                        </>
                    ):(
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" id="company-name" placeholder="Company Name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">job-title</label>
                                <input type="text" name="job-title" id="job-title" placeholder="job-title"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">job-title</label>
                                <textarea rows={5} name="job-description" id="job-description" placeholder="job-description"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>
                            <button className="primary-button" type="submit">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload