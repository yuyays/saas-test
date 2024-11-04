"use client";

import { useState } from "react";
import LandingPage from "./landing";
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const localhost = process.env.BASE_URL;
const authenticator = async () => {
  try {
    const response = await fetch("BASE_URL/api/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (err) {
    const error = err as Error;
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export default function HomePage() {
  const [filePath, setfilePath] = useState("");
  const onError = (err: any) => {
    console.log("Error", err);
  };

  const onSuccess = (res: any) => {
    console.log("Success", res);
    setfilePath(res.filePath);
  };

  return (
    <main>
      <LandingPage />
      <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        {filePath && (
          <IKImage path={filePath} width={300} height={300} alt="Alt text" />
        )}

        <div>
          <h2>File upload</h2>
          <IKUpload
            fileName="test-upload.png"
            onError={onError}
            onSuccess={onSuccess}
          />
        </div>
      </ImageKitProvider>
    </main>
  );
}
