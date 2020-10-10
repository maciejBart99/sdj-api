export class VolumeSetCommand {
  constructor(
    public channelId: string,
    public sentById: string,
    public volume: number
  ) {}
}
