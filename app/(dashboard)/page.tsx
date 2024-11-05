"use client";

import { useState } from "react";
import LandingPage from "./landing";
import { IKImage, IKUpload } from "imagekitio-next";

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
    </main>
  );
}
