// enable import from json file
declare module "*.json" {
  const value: any;
  export default value;
}
