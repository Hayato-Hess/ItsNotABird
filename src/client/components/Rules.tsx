import { Flex } from "./Flex";

export function Rules() {
  return (
    <div style={{ fontSize: "12px" }}>
      <Flex gap="20px">
        <div
          className="box"
          style={{ marginTop: "1rem", padding: "1rem", flex: "1" }}
        >
          <div style={{ color: "var(--color-primary)" }}>Rules:</div>
          <br />
          <p>
            One person has to descripe a word with the ultimate universal
            language{" "}
            <span style={{ color: "var(--color-primary)" }}>Emojies!</span> All
            others have to guess that word.
          </p>
        </div>
        <div
          className="box"
          style={{ marginTop: "1rem", padding: "1rem", flex: "1" }}
        >
          <div style={{ color: "var(--color-primary)" }}>Credits:</div>
          <br />
          <p>
            <div>Art:</div>
            <div>
              - Tanja{" "}
              <a href="https://oobloodyorangeoo.itch.io/">[BloodyOrange]</a>
            </div>
          </p>
          <p>
            <div>Programming:</div>
            <div>- Hayato</div>
            <div>
              - Marian <a href="https://theras.itch.io/">[Theras]</a>
            </div>
          </p>
        </div>
      </Flex>
    </div>
  );
}
