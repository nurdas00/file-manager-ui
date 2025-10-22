import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/files"
});

export const getFolders = (path = "") =>
    api.get("/folders", { params: { path } });

export const getFiles = (path = "") =>
    api.get("/files", { params: { path } });

export const uploadFile = (path, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, { params: { path } });
};

export const deleteFile = (path) =>
    api.delete("/delete", { params: { path } });

export const downloadFile = (path) =>
    window.open(`${api.defaults.baseURL}/download?path=${encodeURIComponent(path)}`);

export const createFolder = (path, folderName) =>
    api.post("/create-folder", null, { params: { path, name: folderName } });
