import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, RewardAdOptions, InterstitialDefinitions, BannerAdPosition  } from '@capacitor-community/admob';

import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class AdMobService {
  constructor() {
    this.initializeAdMob();
  }

  private async initializeAdMob() {
    try {
      // Initialize AdMob directly
      await AdMob.initialize();
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  showBannerAd(adId: string) {
   const options: BannerAdOptions = {
  adId: 'ca-app-pub-3940256099942544/6300978111',
  position: BannerAdPosition.BOTTOM_CENTER
};
    return AdMob.showBanner(options).catch(err => {
      console.error('Failed to display banner ad:', err);
    });
  }

  hideBannerAd() {
    return AdMob.hideBanner().catch(err => {
      console.error('Failed to hide banner ad:', err);
    });
  }

  showInterstitialAd(adId: string) {
    return AdMob.prepareInterstitial({ adId })
      .then(() => AdMob.showInterstitial())
      .catch(err => {
        console.error('Failed to display interstitial ad:', err);
      });
  }

  showRewardedAd(adId: string) {
    return AdMob.prepareRewardVideoAd({ adId })
      .then(() => AdMob.showRewardVideoAd())
      .catch(err => {
        console.error('Failed to display rewarded ad:', err);
      });
  }
}
