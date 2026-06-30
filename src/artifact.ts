/** 🏷️ The fundamental type of artifact. */
export enum ArtifactType {
  DOCUMENT = "DOCUMENT",

  /** ✨ A discovered opportunity before mining. */
  OPPORTUNITY = "OPPORTUNITY",

  /** 💰 A mined value. */
  VALUE = "VALUE",

  /** 📦 A container (box) combining several artifacts. */
  BOX = "BOX",
}

export interface IArtifact {
  /** 🧬 Unique identifier for this artifact. */
  id: string;

  /** DAO token symbol */
  dao: string;

  /** 🏷️ The fundamental type of artifact. */
  type: ArtifactType;

  /** 📃 Artifact area-specific data. */
  data: any;

  /** ⏰ Creation timestamp in milliseconds. */
  created: number;
}

export interface ICompareItem {
  title: string;
  we: string | number | bigint;
  competitor: string | number | bigint;
}
