# Rokulezrive

Rokulezrive is a file uploader, a stripped-down version of Google Drive built with React. Allows users to upload, download and share files. Hosted on Vercel.

![website screenshots](https://i.imgur.com/jjFC9Kq.png)

## Links

- Live Demo: [https://www.rokulezrive.com](https://www.rokulezrive.com)
- Backend Repository: [https://github.com/whitesgr03/rokulezrive-api](https://github.com/whitesgr03/rokulezrive-api)

## Features:

- Password and Social authentication.
- Upload and Share any type of files.
- Responsive design for mobile devices.

## Usage:

You can upload or share files on the [Live Demo](https://www.rokulezrive.com) through your web browser.

<details>

- Login with Google, Facebook or your email and password.

  <img src="https://i.imgur.com/uHDIW74.png" alt="website screenshot">
  <img src="https://i.imgur.com/PyhnYsV.png" alt="website screenshot">

- If you forget your password, you cant get it back.

   <img src="https://i.imgur.com/lDLvWzb.png" alt="website screenshot">

- Upload file and check out file information.

   <img src="https://i.imgur.com/gnEqq9B.png" alt="website screenshot">
   <img src="https://i.imgur.com/nrbenht.png" alt="website screenshot">

- Rename and delete a folder or file.

  <img src="https://i.imgur.com/5FAWdSv.png" alt="website screenshot">
  <img src="https://i.imgur.com/nObOzFq.png" alt="website screenshot">

- Share your files with other users or anyone without an account.

  <img src="https://i.imgur.com/UBzYxnw.png" alt="website screenshot">

</details>

## Technologies:

1. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

2. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

3. [Supabase](https://supabase.com/) allows users to register and login and get access token to request resources.

## Additional info:

- The API server currently uses the Supabase auth provider to authenticate users. In the future, I planned to create my own authentication system.

## Source folder structure

```
src/
│
├─── __test__/                          # component and unit tests
│
├─── assets/                            # Static assets (icons, images)
│
├─── components/                        # React components and each related css modules are placed in folders
│     │
│     ├── layout/
│     │    │
│     │    ├── Footer/
│     │    │    │
│     │    │    └── Footer.jsx
│     │    │
│     │    ├── Header/
│     │    │    │
│     │    │    └── Header.jsx
│     │    │
│     │    └── Navbar/
│     │         │
│     │         └── Navbar.jsx
│     │
│     ├── pages/
│     │    │
│     │    ├── Account/
│     │    │    │
│     │    │    ├── Account.jsx
│     │    │    │
│     │    │    ├── Forget_Email.jsx
│     │    │    │
│     │    │    ├── Login.jsx
│     │    │    │
│     │    │    ├── Password_Reset.jsx
│     │    │    │
│     │    │    ├── Register.jsx
│     │    │    │
│     │    │    └── Validation_Email.jsx
│     │    │
│     │    ├── App/
│     │    │    │
│     │    │    ├── App.jsx
│     │    │    │
│     │    │    ├── Modal.jsx
│     │    │    │
│     │    │    └── Public_File.jsx
│     │    │
│     │    ├── Drive/
│     │    │    │
│     │    │    ├── Folder/
│     │    │    │    │
│     │    │    │    ├── File/
│     │    │    │    │    │
│     │    │    │    │    ├── File_Delete.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── File_Info.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── File_Share.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── File_Update.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── File_Upload.jsx
│     │    │    │    │    │
│     │    │    │    │    └── Files.jsx
│     │    │    │    │
│     │    │    │    ├── Subfolder/
│     │    │    │    │    │
│     │    │    │    │    ├── Folder_Create.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── Folder_Delete.jsx
│     │    │    │    │    │
│     │    │    │    │    ├── Folder_Update.jsx
│     │    │    │    │    │
│     │    │    │    │    └── Subfolders.jsx
│     │    │    │    │
│     │    │    │    └── Folder.jsx
│     │    │    │
│     │    │    ├── Drive.jsx
│     │    │    │
│     │    │    ├── Shared_Delete.jsx
│     │    │    │
│     │    │    ├── Shared_File.jsx
│     │    │    │
│     │    │    ├── Shares.jsx
│     │    │    │
│     │    │    └── Upload_List.jsx
│     │    │
│     │    └── Home/
│     │         │
│     │         └── Home.jsx
│     │
│     └── utils/
│          │
│          ├── Authentication/
│          │    │
│          │    └── Authentication.jsx
│          │
│          ├── Error/
│          │    │
│          │    ├── Error.jsx
│          │    │
│          │    └── NotFound.jsx
│          │
│          └── Loading/
│               │
│               └── Loading.jsx
│
├─── styles/                            # Generic CSS Modules
│     │
│     ├── form.module.css
│     │
│     ├── icon.module.css
│     │
│     └── index.css                     # Index css include main custom properties and type selectors styles
│
├─── utils/                             # Generic function
│     ├── create_download_element.js    # Handle creating an anchor element to download the file
│     │
│     ├── format_bytes.js               # Handle formatting the upload file bytes
│     │
│     ├── handle_fetch.js
│     │
│     └── supabase_client.js            # Handle connection with the supabase auth database
│
├─── main.jsx
│
└──  Router.jsx                         # React router config
```
