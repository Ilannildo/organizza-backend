import { emailBodyHtml } from "./email_body";

export const emailConfirmationAccountHtml = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => {
  const message = `<table
      style="font-family: 'Cabin', sans-serif"
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      border="0"
    >
      <tbody>
        <tr>
          <td
            style="
              overflow-wrap: break-word;
              word-break: break-word;
              padding: 33px 55px;
              font-family: 'Cabin', sans-serif;
            "
            align="left"
          >
            <div
              style="
                line-height: 160%;
                text-align: center;
                word-wrap: break-word;
              "
            >
              <p style="font-size: 14px; line-height: 160%">
                <span
                  style="
                    font-size: 22px;
                    line-height: 35.2px;
                  "
                  >Olá, ${name}
                </span>
              </p>
              <p style="font-size: 14px; line-height: 160%">
                <span
                  style="
                    font-size: 18px;
                    line-height: 28.8px;
                  "
                  >
                    Você está quase pronto para começar.
                    Clique no botão abaixo para verificar seu
                    endereço de e-mail e aproveite os eventos!
                </span>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <table
      style="font-family: 'Cabin', sans-serif"
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      border="0"
    >
      <tbody>
        <tr>
          <td
            style="
              overflow-wrap: break-word;
              word-break: break-word;
              padding: 10px;
              font-family: 'Cabin', sans-serif;
            "
            align="left"
          >
            <div align="center">
              <a
                href=${link}
                target="_blank"
                class="v-button"
                style="
                  box-sizing: border-box;
                  display: inline-block;
                  font-family: 'Cabin', sans-serif;
                  text-decoration: none;
                  -webkit-text-size-adjust: none;
                  text-align: center;
                  color: #ffffff;
                  background-color: #ff6600;
                  border-radius: 4px;
                  -webkit-border-radius: 4px;
                  -moz-border-radius: 4px;
                  width: auto;
                  max-width: 100%;
                  overflow-wrap: break-word;
                  word-break: break-word;
                  word-wrap: break-word;
                  mso-border-alt: none;
                "
              >
                <span
                  style="
                    display: block;
                    padding: 14px 44px 13px;
                    line-height: 120%;
                  "
                  ><span
                    style="
                      font-size: 16px;
                      line-height: 19.2px;
                    "
                    ><strong
                      ><span
                        style="
                          line-height: 19.2px;
                          font-size: 16px;
                        "
                        >VERIFICAR E-MAIL</span
                      ></strong
                    >
                  </span>
                </span>
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>`;

  return emailBodyHtml({
    title: "OBRIGADO   POR   SE   CADASTRAR !",
    subtitle: "Verifique seu e-mail",
    icon_url:
      "https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png",
    message,
  });
};
