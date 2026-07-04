import ImageKit from "@imagekit/nodejs";

const imageKit = new ImageKit({
  privateKey: process.env.PRIVATE_KEY!,
});

export default imageKit;
