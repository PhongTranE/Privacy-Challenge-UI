import "@/styles/RulesPage.scss";
import { Button, CopyButton, Divider, Text } from "@mantine/core";

const RulesPage: React.FC = () => {
  interface RulesSection {
    id: number;
    title: string;
    link: string;
  }

  const ruleSections: RulesSection[] = [
    {
      id: 1,
      title: "Introduction",
      link: "https://docs.google.com/document/d/e/2PACX-1vRCWk6yIxzfylhms5PVVGnGkzW4l4UbpejnyhaFrqfMRKfQpZzdSb75_ObW4iBnJ8vGx16uDDncBJ1k/pub",
    },
    {
      id: 2,
      title: "Phase 1: Anonymiation",
      link: "https://docs.google.com/document/d/e/2PACX-1vRCWk6yIxzfylhms5PVVGnGkzW4l4UbpejnyhaFrqfMRKfQpZzdSb75_ObW4iBnJ8vGx16uDDncBJ1k/pub",
    },
    {
      id: 3,
      title: "Phase 2: Attack on anonymized data",
      link: "https://docs.google.com/document/d/e/2PACX-1vRCWk6yIxzfylhms5PVVGnGkzW4l4UbpejnyhaFrqfMRKfQpZzdSb75_ObW4iBnJ8vGx16uDDncBJ1k/pub",
    },
    {
      id: 4,
      title: "Ranking and Score",
      link: "https://docs.google.com/document/d/e/2PACX-1vRCWk6yIxzfylhms5PVVGnGkzW4l4UbpejnyhaFrqfMRKfQpZzdSb75_ObW4iBnJ8vGx16uDDncBJ1k/pub",
    },
  ];

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        <section className="rules-section">
          <div className="rules-content">
            <Text fw={700} size="xl" c="#ff8c00">
              Contest Rules
            </Text>
            <Divider my="lg" />
            <Text size="xs" c="#CCCCCC">
              Select a section below to read the rules.
            </Text>
            <ul className="rules__list">
              {ruleSections.map((section) => (
                <li key={section.id} className="rules__item">
                  <a
                    href={section.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rules__link"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
            <Divider my="lg" />
            <div className="wrap-key">
              <Text size="xs" c="#FFBF00" fw={700}>
                Please copy the key on the right before proceeding to the registration
                page.
              </Text>
              <CopyButton value="https://mantine.dev">
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied key" : "Copy key"}
                  </Button>
                )}
              </CopyButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RulesPage;
