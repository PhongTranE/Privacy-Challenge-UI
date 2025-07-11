import "@/styles/Pages/Protected/StartingPage.scss";
import { Text } from "@mantine/core";
import { DownloadRawFileButton } from "@/components/DownloadRawFileButton";

const StartingPage: React.FC = () => {
  return (
    <>
      <main className="">
        <section className="starting-section">
          <div className="starting-content">
            <Text className="text-[50px]" fw={700} c="#ff8c00">
              SOURCE FILE
            </Text>
            <Text size="lg">
              Remember to download the source file below to begin the
              anonymization test.
            </Text>
          </div>
          <div className="starting-download">
            <Text className="text-[30px]" c="#ff8c00">
              File to download:
            </Text>
            <DownloadRawFileButton />
          </div>
        </section>
      </main>
    </>
  );
};

export default StartingPage;
