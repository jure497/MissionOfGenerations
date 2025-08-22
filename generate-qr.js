import QRCode from "qrcode";

async function run() {
  await QRCode.toFile("./public/qr-grandchild.png", "http://localhost:3000/quiz?role=grandchild");
  await QRCode.toFile("./public/qr-grandparent.png", "http://localhost:3000/quiz?role=grandparent");
  console.log("✅ QR codes created in public/ (qr-grandchild.png, qr-grandparent.png)");
}
run();
