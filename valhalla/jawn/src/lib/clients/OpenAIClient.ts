// Remove the import statement for "fs"
import { OpenAI } from "openai";
import { Result, ok } from "../../packages/common/result";
import { FileObject } from "openai/resources";
import { FineTuningJob } from "openai/resources/fine-tuning/jobs";
import fs from "fs";

export class OpenAIClient {
  private openai: OpenAI;
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://oai.helicone.ai/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
      }
    });
  }

  async createFineTuneJob(
    fileId: string,
    model: string
  ): Promise<Result<FineTuningJob, string>> {
    const fineTune = await this.openai.fineTuning.jobs.create({
      training_file: fileId,
      model: model,
    });

    return ok(fineTune);
  }

  // TODO: Limit to 1 gb
  async uploadFineTuneFile(
    trainingFilePath: string
  ): Promise<Result<FileObject, string>> {
    const file = await this.openai.files.create({
      file: fs.createReadStream(trainingFilePath),
      purpose: "fine-tune",
    });

    return ok(file);
  }
}
