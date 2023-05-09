# MyPocket Project Deployment Guide

This guide will walk you through the steps to deploy the MyPocket project locally and on Vercel.

## Step 1: Fork and clone the project

Fork the project repository on GitHub by clicking the "Fork" button on the top-right corner of the repository page. Once you have your own forked repository, clone it to your local machine using the following command:

```bash
git clone https://github.com/your-username/repo_name.git
```

Make sure to replace `your-username` & `repo_name` with your actual GitHub username and repository name. This will create a local copy of the project on your machine that you can work with.

## Step 2: Create a .env file

Navigate to the project root directory `/repo_name` and create a `.env` file:

Paste the following variables into the `.env` file:

```bash
SECRET_KEY=anything_secret
NEXTAUTH_SECRET=anything_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_URL=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

## Step 3: Obtain Cloudinary .env variables

Follow the steps in the provided [Cloudinary PDF guide](https://res.cloudinary.com/theaafofficial/image/upload/v1683626244/Public/Cloudinary_Workflow_vrherj.pdf) to set up your Cloudinary account and obtain the necessary API keys and credentials. Once you have them, paste them into the `.env` file, filling in the corresponding variables:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
CLOUDINARY_URL=your_cloudinary_url
```

## Step 4: Obtain Firebase .env variables

Follow the steps in the provided [Firebase PDF guide](https://res.cloudinary.com/theaafofficial/image/upload/v1683626244/Public/Create_Firebase_project_s3bk5s.pdf) to set up your Firebase project and obtain the necessary API keys and credentials. Once you have them, paste them into the `.env` file, filling in the corresponding variables:

```bash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Step 5: Deploy on Vercel

Now that you have set up the `.env` file, you can now deploy on vercel using the the provided [Vercel PDF guide](https://res.cloudinary.com/theaafofficial/image/upload/v1683626243/Public/HowtoImportandDeployaRepositoryonVercel_r7wpwk.pdf)


## Optional: Run Locally

You can run the project locally by going to project root and run following commands 

```bash
npm install
```

Then, run the project:

```bash
npm run dev
```

The project should now be running locally at `http://localhost:3000`.

