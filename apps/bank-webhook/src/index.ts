import express, { Express, Request, Response } from "express";
import { z } from "zod";

import db from "@repo/database";

const app = express();
app.use(express.json());

//zod types

const webhookSchema = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.number(),
});

interface ResponseType {
  success: boolean;
  message: string;
}

app.post(
  "/hdfcWebhook",
  async (req: Request, res: Response<ResponseType>): Promise<any> => {
    try {
      const { token, user_identifier: userId, amount } = req.body;

      const parsedData = webhookSchema.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: "invalid" });
      }

      const paymentInformation = {
        token,
        userId,
        amount,
      };

      //update balance in db
      await db.$transaction([
        db.balance.updateMany({
          where: {
            userId: Number(paymentInformation.userId),
          },
          data: {
            amount: {
              // You can also get this from your DB
              increment: Number(paymentInformation.amount),
            },
          },
        }),
        db.onRampTransaction.updateMany({
          where: {
            token: paymentInformation.token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);

      return res
        .status(200)
        .json({ success: true, message: "payment successful" });
    } catch (error: any) {
      console.error("some error or parsing error", error);
      res.status(411).json({ success: false, message: error.message });
    }
  }
);

app.listen(5000, () => {
  console.log("listening on port 5000");
});
