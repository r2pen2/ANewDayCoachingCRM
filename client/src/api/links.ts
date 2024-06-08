/**
 * Represents a collection of links.
 */
export class LinkMaster {

  static venmoUser: string = "r2pen2"

  /**
   * Contains payment links.
   * @property {string} venmo - The link to the venmo payment page.
   * @property {string} zelle - The link to the zelle payment page.
   */
  static payments: any = {
    // venmo: "https://venmo.com/u/r2pen2",
    zelle: "https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiSk9TRVBIIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNzgxODc5OTA1OCJ9"
  }

  /**
   * Contains schedule links.
   * @property {string} calendarEmbed - The link to the calendar embed.
   */
  static schedule: any = {
    calendarEmbed: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2J3ZABQTIlgx_Exw3x8rZU6w_jmcQOhL_S99FeVu1B4BXLWwMO-XX6c_73b8p_3fyLDKiYpVWU?gv=true"
  }

  static createVenmoLink(amount: number, invoiceNumber: number, displayName: string): string {
    return `https://venmo.com/?txn=pay&audience=private&recipients=${LinkMaster.venmoUser}&amount=${amount}&note=${displayName}'s%20ANDC%20Invoice%20No.${invoiceNumber}`
  }

  static ensureAbsoluteUrl(url: string) {
    // Check if the URL starts with http://, https://, or // (protocol-relative URL)
    if (!/^https?:\/\//i.test(url) && !/^\/\//.test(url)) {
        // If not, prepend "https://" to the URL
        url = "https://" + url;
    }
    return url;
  }

  static async getPageTitle(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => { 
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          const title = doc.querySelectorAll('title')[0];
          resolve(title.innerText);
        }
      );
    })
  }
}