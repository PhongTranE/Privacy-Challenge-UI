import RankingAttack from "@/components/ranking/RankingAttack";
import RankingFilter from "@/components/ranking/RankingFilter";
import RankingOverall from "@/components/ranking/RankingOverall";
import RankingSubmission from "@/components/ranking/RankingSubmission";
import "@/styles/Pages/Public/RankingPage.scss";
import { Text } from "@mantine/core";

const RankingPage: React.FC = () => {
  return (
    <>
      <main>
        <section className="ranking-section">
          <div className="ranking-container">
            <Text className="heading" ta="center" c="rgb(255, 140, 0)" fw={700}>
              Ranking Page
            </Text>

            {/* Ranking filter */}
            <RankingFilter />

            {/* Overall result */}
            <RankingOverall />

            {/* Submission */}
            <RankingSubmission />

            {/* Attack */}
            <RankingAttack />
          </div>
        </section>
      </main>
    </>
  );
};

export default RankingPage;
