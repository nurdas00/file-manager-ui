import React, { useEffect, useState } from "react";
import { getFolders, getFiles, uploadFile, deleteFile, downloadFile, createFolder } from "./api";

export default function App() {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState("");
    const [uploadFileInput, setUploadFileInput] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");

    // Load current folder content
    useEffect(() => {
        loadFolders();
    }, [currentPath]);

    const loadFolders = () => {
        getFolders(currentPath).then(res => setFolders(res.data));
        getFiles(currentPath).then(res => setFiles(res.data));
    };

    const openFolder = (folder) => {
        const path = currentPath ? `${currentPath}/${folder}` : folder;
        setCurrentPath(path);
    };

    const goUp = () => {
        if (!currentPath) return;
        const parts = currentPath.split("/");
        parts.pop();
        setCurrentPath(parts.join(""));
    };

    const handleUpload = () => {
        if (!uploadFileInput) return;
        uploadFile(currentPath, uploadFileInput).then(() => {
            setUploadFileInput(null);
            loadFolders();
        });
    };

    const handleDelete = (name) => {
        const path = currentPath ? `${currentPath}/${name}` : name;
        deleteFile(path).then(loadFolders);
    };

    const handleDownload = (name) => {
        const path = currentPath ? `${currentPath}/${name}` : name;
        downloadFile(path);
    };

    const handleCreateFolder = () => {
        if (!newFolderName) return;
        createFolder(currentPath, newFolderName)
            .then(() => {
                setNewFolderName("");
                loadFolders();
            });
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>File Manager</h1>

            <div>
                <button onClick={goUp} disabled={!currentPath}>Go Up</button>
                <span style={{ marginLeft: 10 }}>{currentPath || "/"}</span>
            </div>

            <h2>Create Folder</h2>
            <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
            />
            <button onClick={handleCreateFolder}>Create</button>

            <h2>Folders</h2>
            <div>
                {folders.map(f => (
                    <button
                        key={f}
                        style={{ marginRight: 10, marginBottom: 10 }}
                        onClick={() => openFolder(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <h2>Files</h2>
            <ul>
                {files.map(f => (
                    <li key={f}>
                        {f} &nbsp;
                        <button onClick={() => handleDownload(f)}>Download</button>
                        <button onClick={() => handleDelete(f)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Upload File</h2>
            <input type="file" onChange={(e) => setUploadFileInput(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
