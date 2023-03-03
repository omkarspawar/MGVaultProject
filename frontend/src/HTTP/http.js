
// if the server port is changed please change proxy address and this baseAddress also are else keep server port as it is i.e. 4000 //
let BaseAddress="http://localhost:4000"

export const URLData = {
    Register: '/api/Register',
    Login:  '/api/Login',
    GetorDeleteFiles: '/api/Document',
    DirectDownloadDoc: BaseAddress+'/api/DownloadDocument',
    UploadNewFile: '/api/Document/upload',
    DownloadFile: '/api/Document/downloadDocument',
}

