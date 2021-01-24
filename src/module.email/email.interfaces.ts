export default interface IEmailSender {
  send(email: string, uuid: string): Promise<void>
}
