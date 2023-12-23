export interface welcomeMailDto {
  to: string;
  subject: string;
  template: "welcome";
  context: {
    name: string;
  };
}
