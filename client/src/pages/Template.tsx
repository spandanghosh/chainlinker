import DonationEtherium from "@/components/DonationEtherium";
import DonationStarknet from "@/components/DonationStarknet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface TemplateData {
  templateId: string;
  chain: string;
  templateType: string;
  receiverAddress: string;
  imageUrl: string;
  bgColor: string;
  buttonColor: string;
  heading: string;
  text: string;
  btnText: string;
  contractAddress: `0x${string}`;
  functionToInvoke: string;
  abiUrl: string;
  options: string[];
  pollId: number;
  pollColor: string;
}

function Template() {
  const { id } = useParams<{ id: string }>(); // Extract 'id' from the URL
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${id}`;
        const response = await fetch(ipfsUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch template data: ${response.statusText}`
          );
        }

        const data: TemplateData = await response.json();
        setTemplateData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!templateData) return <p>No template data found.</p>;

  return templateData.chain === "Starknet" ? (
    <DonationStarknet
      bgColor={templateData.bgColor}
      imageUrl={templateData.imageUrl}
      heading={templateData.heading}
      text={templateData.text}
      buttonColor={templateData.buttonColor}
      btnText={templateData.btnText}
      recieverAddress={templateData.receiverAddress} // Fixed typo
    />
  ) : (
    <DonationEtherium
      chain={templateData.chain}
      bgColor={templateData.bgColor}
      imageUrl={templateData.imageUrl}
      heading={templateData.heading}
      text={templateData.text}
      buttonColor={templateData.buttonColor}
      btnText={templateData.btnText}
      recieverAddress={templateData.receiverAddress} // Fixed typo
    />
  );
}

export default Template;
