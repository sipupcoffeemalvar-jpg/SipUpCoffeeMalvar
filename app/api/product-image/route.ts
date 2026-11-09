import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image selected" },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG and PNG images are allowed" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directory
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "img",
      "products"
    );

    // Create folder if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true });

    //Get File without special characters
  
const newFileName = file.name
  .replace(/\.[^/.]+$/, "")  // Remove file extension
  .replace(/[^a-zA-Z0-9]/g, ""); // Remove spaces and special characters



    // Get extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    // Generate unique filename
    const fileName = `${newFileName}_${new Date().toISOString().slice(0, 10)}.${extension}`;

    // Full physical path
    const filePath = path.join(uploadDir, fileName);

    // Save image
    await fs.writeFile(filePath, buffer);

    // Path that will be saved in database
    const imagePath = `/img/products/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      imagePath,
    });
  } catch (error) {
    console.log("Image upload error:", error);

    return NextResponse.json(
      { 
      error: String(error),},
      { status: 500 }
    );
  }
}