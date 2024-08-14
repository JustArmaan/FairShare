type LineItem = {
  item_key: string;
  item_name: string;
  item_quantity: string;
  item_value: string;
};

type ExtractedText = {
  date: string;
  discount: string;
  line_items: LineItem[];
  phone: string;
  store_addr: string;
  store_name: string;
  subtotal: string;
  svc: string;
  tax: string;
  time: string;
  tips: string;
  total: string;
};

type ReceiptResponse = {
  extracted_text: ExtractedText;
};

export async function getReceiptData(
  imagePath: string
): Promise<ReceiptResponse> {
  console.log("Getting receipt data for image:", imagePath);
  const responseData = await fetch("http://127.0.0.1:5000/extract_text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_path: imagePath }),
  });

  return responseData.json();
}
