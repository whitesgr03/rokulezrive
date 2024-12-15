# Rokulezrive

A cloud storage application built with React. Hosted on Vercel.  

![website screenshots](https://i.imgur.com/jjFC9Kq.png)

## Links

- Live Demo: [https://www.rokulezrive.com](https://www.rokulezrive.com)
- Backend Repository: [https://github.com/whitesgr03/rokulezrive-api](https://github.com/whitesgr03/rokulezrive-api)

## Description:

Rokulezrive is a file uploader built as a stripped down version of Google Drive. Allows users to upload, download and share files.

<details>
  <summary>Additional info</summary>
  
  - At first I planned to use Passport.js to build an authentication system, but I'm new to user email validation and token expiration handling, so I decided to use the auth provider Supabase for authentication and authorization.

  - Cloudinary is currently used to store user files and may be changed to Supabase Storage in the future for convenience to manage together with database and auth services.
</details>

## Technologies:  

1. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

2. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

## Features:

- User authentication.
- Upload any type of files.
- Share files with everyone.
- Folder and file management.
- Responsive design.

## Usage:

You can access the app through your web browser.

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