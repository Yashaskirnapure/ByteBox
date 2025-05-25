## Backend APIs Guide:

| **Method** | **Endpoint**                                | **Description**                    | **Body / Query  Params**                                                     | **Response**                     |
|------------|---------------------------------------------|------------------------------------|------------------------------------------------------------------------------|----------------------------------|
| `GET`      | `/api/file`                                 | Fetch files/folders in a directory | `userId`, `workingDir` (query params)                                        | `Array<FileData>`               |
| `POST`     | `/api/file/upload`                          | Upload a new file                  | `FormData`: `file`, `userId`, `parentId` (optional)                          | `201 Created` or error message  |
| `POST`     | `/api/folder`                               | Create a new folder                | `JSON`: `{ name, userId, parentID (optional) }`                              | `201 Created` or error message  |
| `PATCH`    | `/api/file`                                 | Trash collection of files/folders  | `JSON` : `{ "fileIDs: []" }`                                                 | `201 Moved` or error message    |
| `DELETE`   | `/api/file/[id]/delete?userId=<>`           | Delete files/folder permanantly    | `JSON` : `null` |