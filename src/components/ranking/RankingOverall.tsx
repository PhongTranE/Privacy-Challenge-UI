import { Table, Badge, Paper, Anchor, Container } from "@mantine/core";

const data = [
  {
    name: "APL",
    defenseScore: "0%",
    defenseRank: 2,
    attackRating: "0.3002/2",
    attackRank: 1,
  },
  {
    name: "Pig",
    defenseScore: "37.26%",
    defenseRank: 1,
    attackRating: "0/2",
    attackRank: 2,
  },
  {
    name: "ABC",
    defenseScore: "0%",
    defenseRank: 3,
    attackRating: "0/2",
    attackRank: 3,
  },
];

function RankingOverall() {
  return (
    <Container size="lg" py="md">
      <Paper
        withBorder
        p="sm"
        radius="md"
        style={{ borderColor: "#e08b3d94", backgroundColor: "#000",marginBottom: "80px" }}
      >
        <Table
          highlightOnHover
          withColumnBorders
          verticalSpacing="sm"
          horizontalSpacing="md"
          fs="sm"
        >
          <thead style={{ backgroundColor: "#fa5252" }}>
            <tr>
              <th className="pl-10 text-left text-white">Overall result</th>
              <th className="text-left text-white">Team Name</th>
              <th className="text-left text-white">Defense Score</th>
              <th className="text-left text-white">Attack Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((team) => (
              <tr className="border-b border-white/20" key={team.name}>
                <td></td>
                <td className="py-2">
                  <Anchor
                    href={`#${team.name.toLowerCase()}`}
                    c="blue.3"
                    underline="always"
                  >
                    {team.name}
                  </Anchor>
                </td>
                <td style={{ color: "white" }}>
                  {team.defenseScore}{" "}
                  <Badge color="gray" size="sm" variant="filled">
                    {team.defenseRank}
                  </Badge>
                </td>
                <td style={{ color: "white" }}>
                  {team.attackRating}{" "}
                  <Badge
                    color={team.attackRank === 1 ? "orange" : "gray"}
                    size="sm"
                    variant="filled"
                  >
                    {team.attackRank}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export default RankingOverall;
