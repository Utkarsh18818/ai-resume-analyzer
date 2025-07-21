import {useCallback} from "react";
import {useDropzone} from "react-dropzone";

interface FileUploaderProps{
    onFileSelect: (file: File | null) => void;
}

const FileUploader = ({onFileSelect}:FileUploaderProps) =>{
    const onDrop = useCallback((acceptedFiles: File[])=>{
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    },[onFileSelect])
    const {getRootProps,getInputProps,isDragActive,acceptedFiles} = useDropzone({
        onDrop,
        multiple:false,
        accept:{"application/pdf":['.pdf']},
        maxSize:20*1024*1024,
    })
    const file = acceptedFiles[0] || null;
    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} className="cursor-pointer px-4 py-6 rounded-md bg-gray-100 text-center"/>
                <div className="space-y-4 cursor-pointer">
                <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                    <img src="/icons/info.svg" alt="upload" className="size-20"/>
                </div>
                {file ? (
                    <div className="uploader-selected-file" onClick={(e)=>e.stopPropagation()}>
                        <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                        <div className="flex items-center gap-3">
                            <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                                <p className="text-sm text-gray-500"> {file.size} </p>
                            </div>
                        </div>
                        <button className="p-2 cursor-pointer" onClick={(e)=>
                        onFileSelect?.(null)
                        }>

                        </button>
                    </div>
                ):(
                    <div>
                        <p className="text-lg text-gray-500 ">
                            <span className="font-semibold">
                                Click to Upload
                            </span> or drag and drop
                        </p>
                        <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader;