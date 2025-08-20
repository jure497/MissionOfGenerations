import QRCode from "qrcode";
import fs from "fs";

async function generate() {
  await QRCode.toFile("./public/qr-grandchild.png", "http://localhost:3000/?role=grandchild");
  await QRCode.toFile("./public/qr-grandparent.png", "http://localhost:3000/?role=grandparent");
  console.log("QR codes generated!");
}

generate();
