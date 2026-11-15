import { Flex } from "./Flex";

export function Rules() {
  return (
    <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
      <Flex gap="20px" wrap>
        <div
          className="box"
          style={{
            marginTop: "1rem",
            flex: "1",
            minWidth: "20rem",
          }}
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
        <div className="box" style={{ marginTop: "1rem", flex: "1" }}>
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
            <div>
              - Hayato <a href="https://TehYato.itch.io/">[TehYato]</a>
            </div>
            <div>
              - Marian <a href="https://theras.itch.io/">[Theras]</a>
            </div>
          </p>
        </div>
      </Flex>
      <div className="box" style={{ marginTop: "1rem", flex: "1" }}>
        <p>
          <div style={{ color: "var(--color-primary)" }}>AI Usage:</div>
          <br />
          <div>
            We tried to use as litle AI assistance as possible in this project.
            We only used it for followig topics:
          </div>
          <div>
            - Making our slightly responsive layout fully responsive to
            different screen sizes{" "}
          </div>
          <div>
            - Assiting in the scale and rotation logic of emoji placement
          </div>
          <div>
            - Allowing us to to export a `.exe` so you can play at home once our
            server is no longer available
          </div>
        </p>
      </div>
    </div>
  );
}
