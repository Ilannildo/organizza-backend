import { app } from "./app";
import chalk from "chalk";

app.listen(process.env.PORT || 8000, () => {
  const server = `${
    (process.env.NODE_ENV === "production" ? "https://" : "http://") +
    process.env.HOST
  }:${process.env.PORT}`;

  // logging initialization
  console.log("\n");
  console.log(chalk.bgCyan(process.env.APP_NAME));
  console.log(chalk.cyan(`Environment:     ${process.env.NODE_ENV}`));
  console.log(chalk.cyan(`Server:          ${server}`));
  console.log("\n");
});
