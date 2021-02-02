import {
  SharkStartNote,
  SharkEndNote,
  TestStartNote,
  TestEndNote,
  AssertionNote,
} from "./types";

/**
 *
 */
export type ReporterNote =
  | SharkStartNote
  | SharkEndNote
  | TestStartNote
  | TestEndNote
  | AssertionNote;

/**
 *
 */
export interface ReporterRecipe {
  onBegin?: () => void;
  onEnd?: () => void;
  onNote?: (note: ReporterNote, change: ReporterLevelChange) => void;
  onSharkStartNote?: (note: SharkStartNote) => void;
  onSharkEndNote?: (note: SharkEndNote) => void;
  onTestStartNote?: (note: TestStartNote) => void;
  onTestEndNote?: (note: TestEndNote) => void;
  onAssertionNote?: (note: AssertionNote) => void;
}

/**
 *
 */
export type ReporterLevelChange = -1 | 0 | 1;

/**
 *
 */
export class Reporter {
  protected recipe: ReporterRecipe;
  public level: number = 0;

  /**
   *
   */
  public constructor(recipe?: ReporterRecipe) {
    this.recipe = recipe || {};
  }

  /**
   *
   */
  public begin() {
    this.onBegin();
  }

  /**
   *
   */
  public end() {
    this.onEnd();
  }

  /**
   *
   */
  public note(note: ReporterNote) {
    const level = this.level;

    if (note.type === "SharkStartNote") {
      this.level++;
      this.onSharkStartNote(note);
    } else if (note.type === "SharkEndNote") {
      this.level--;
      this.onSharkEndNote(note);
    } else if (note.type === "TestStartNote") {
      this.level++;
      this.onTestStartNote(note);
    } else if (note.type === "TestEndNote") {
      this.level--;
      this.onTestEndNote(note);
    } else if (note.type === "AssertionNote") {
      this.onAssertionNote(note);
    }

    const change = (level - this.level) as ReporterLevelChange;
    this.onNote(note, change);
  }

  /**
   *
   */
  public reset() {
    this.level = 0;
  }

  /**
   *
   */
  protected onBegin() {
    if (typeof this.recipe.onBegin === "function") {
      this.recipe.onBegin();
    }
  }

  /**
   *
   */
  protected onEnd() {
    if (typeof this.recipe.onEnd === "function") {
      this.recipe.onEnd();
    }
  }

  /**
   *
   */
  protected onSharkStartNote(note: SharkStartNote) {
    if (typeof this.recipe.onSharkStartNote === "function") {
      this.recipe.onSharkStartNote(note);
    }
  }

  /**
   *
   */
  protected onSharkEndNote(note: SharkEndNote) {
    if (typeof this.recipe.onSharkEndNote === "function") {
      this.recipe.onSharkEndNote(note);
    }
  }

  /**
   *
   */
  protected onTestStartNote(note: TestStartNote) {
    if (typeof this.recipe.onTestStartNote === "function") {
      this.recipe.onTestStartNote(note);
    }
  }

  /**
   *
   */
  protected onTestEndNote(note: TestEndNote) {
    if (typeof this.recipe.onTestEndNote === "function") {
      this.recipe.onTestEndNote(note);
    }
  }

  /**
   *
   */
  protected onAssertionNote(note: AssertionNote) {
    if (typeof this.recipe.onAssertionNote === "function") {
      this.recipe.onAssertionNote(note);
    }
  }

  /**
   *
   */
  protected onNote(note: ReporterNote, change: ReporterLevelChange) {
    if (typeof this.recipe.onNote === "function") {
      this.recipe.onNote(note, change);
    }
  }
}
