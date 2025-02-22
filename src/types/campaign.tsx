
export interface BaseCampaign {
    id: number;
    title: string;
    platform: string;
  }
  
  export interface ActiveCampaign extends BaseCampaign {
    pendingPayout: number;
    progress: number;
    deadline: string;
  }
  
  export interface AvailableCampaign extends BaseCampaign {
    requirements: {
      totalBudget: number;
      contentType: string;
    };
  }
  
  export type Campaign = ActiveCampaign | AvailableCampaign;