import RankingAttack from "@/components/ranking/RankingAttack";
import RankingFilter from "@/components/ranking/RankingFilter";
import RankingOverall from "@/components/ranking/RankingOverall";
import RankingSubmission from "@/components/ranking/RankingSubmission";
import "@/styles/Pages/Public/RankingPage.scss";
import { Text } from "@mantine/core";
import { useState } from "react";

const RankingPage: React.FC = () => {
  const [filteredTeams, setFilteredTeams] = useState<string[]>([]);

  return (
    <>
      <main>
        <section className="ranking-section">
          <div className="ranking-container">
            <Text className="heading" ta="center" c="rgb(255, 140, 0)" fw={700}>
              Ranking Page
            </Text>

            {/* Ranking filter */}
            <RankingFilter onFilter={setFilteredTeams} />

            {/* Overall result */}
            <RankingOverall filteredTeams={filteredTeams} />

            {/* Submission */}
            <RankingSubmission filteredTeams={filteredTeams} />

            {/* Attack */}
            <RankingAttack filteredTeams={filteredTeams} />
          </div>
        </section>
      </main>
    </>
  );
};

export default RankingPage;
