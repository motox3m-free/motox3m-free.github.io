window.MeeGamesSDK = window.MeeGamesSDK || {};

(function(sdk) {
  let rewardedAdReady = true;
  let interstitialAdReady = true;

  function fetchAdData(url) {
    return fetch(url)
      .then(res => res.json())
      .catch(() => {
        return null;
      });
  }
  
  sdk.ShowRewardedAd = function(tag, options) {
    fetchAdData('/api/rewarded').then(data => {
      if (!data || !data.adAvailable) {
        if (options.onAdEmpty) options.onAdEmpty();
        return;
      }

      if (options.onAdReady) options.onAdReady();

      setTimeout(() => {
        if (options.onRewarded) options.onRewarded();
        if (options.onClose) options.onClose();
      }, 2000);
    });
  };
  
  sdk.ShowInterstitialAd = function(tag, options) {
    fetchAdData('/api/interstitial').then(data => {
      if (!data || !data.adAvailable) {
        if (options.onAdInterstitialEmpty) options.onAdInterstitialEmpty();
        return;
      }

      if (options.onBeforeAdImpression) options.onBeforeAdImpression();

      setTimeout(() => {
        if (options.onAdImpression) options.onAdImpression();

        setTimeout(() => {
          if (options.onAdClose) options.onAdClose();
        }, 1500);
      }, 500);
    });
  };

  sdk.setRewardedAdReady = function(isReady) {
    rewardedAdReady = !!isReady;
  };

  sdk.setInterstitialAdReady = function(isReady) {
    interstitialAdReady = !!isReady;
  };

})(window.MeeGamesSDK);

// Function to show rewarded ad
function bienfunction(callback) {
  MeeGamesSDK.ShowRewardedAd('mock-tag', {
    onRewarded: () => {
      // No console output
    },
    onClose: () => {
      callback(true);
    },
    onAdReady: () => {
      // No console output
    },
    onAdEmpty: () => {
      callback(false);
    }
  });
}

// Function to show interstitial ad
function bienfunctionIN(callback) {
  MeeGamesSDK.ShowInterstitialAd('mock-tag', {
    onAdClose: () => {
      callback();
    },
    onBeforeAdImpression: () => {
      // No console output
    },
    onAdImpression: () => {
      // No console output
    },
    onAdInterstitialEmpty: () => {
      callback();
    }
  });
}

/*
// Usage example:
bienfunction(function(rewarded) {
  if (rewarded) {
    // Reward granted
  } else {
    // No reward
  }
});
*/

/*
bienfunctionIN(function() {
  // Continue game after interstitial ad
});
*/


(function(window) {
  // Configuration: Number of ad skips allowed if no ad is available
  const MAX_AD_SKIPS = 10;
  let adSkipCount = 0;

  /**
   * GVAdBreak: Show an interstitial ad using MeeGamesSDK, or fallback if not available.
   * @param {Function} callback - Called after ad finishes or immediately if ad not available.
   */
  window.GVAdBreak = function(callback) {
    if (window.MeeGamesSDK && typeof MeeGamesSDK.ShowInterstitialAd === 'function') {
      MeeGamesSDK.ShowInterstitialAd('gvadbreak', {
        onAdClose: () => {
          if (typeof callback === "function") callback();
        },
        onAdInterstitialEmpty: () => {
          adSkipCount++;
          if (adSkipCount <= MAX_AD_SKIPS) {
            alert(
              "No ads showing at the moment. You can skip ads" +
              (MAX_AD_SKIPS - adSkipCount + 1) + " lần nữa."
            );
            if (typeof callback === "function") callback();
          } else {
            alert(
              "You have run out of ad skips. Please refresh the page to continue playing."
            );
            // Optionally, do not call callback to pause the game
          }
        },
        onBeforeAdImpression: () => {},
        onAdImpression: () => {}
      });
    } else {
      // SDK not available at all
      adSkipCount++;
      if (adSkipCount <= MAX_AD_SKIPS) {
        alert(
          "No ads showing at the moment. You can skip ads" +
          (MAX_AD_SKIPS - adSkipCount + 1) + " lần nữa."
        );
        if (typeof callback === "function") callback();
      } else {
        alert(
          "You have run out of ad skips. Please refresh the page to continue playing."
        );
        // Optionally, do not call callback to pause the game
      }
    }
  };

  /**
   * GVRewardedBreak: Show a rewarded ad using MeeGamesSDK, or fallback if not available.
   * @param {Function} callback - Called with true if rewarded, false otherwise.
   */
  window.GVRewardedBreak = function(callback) {
    if (window.MeeGamesSDK && typeof MeeGamesSDK.ShowRewardedAd === 'function') {
      MeeGamesSDK.ShowRewardedAd('gvrewarded', {
        onRewarded: () => {},
        onClose: () => {
          if (typeof callback === "function") callback(true); // true = rewarded
        },
        onAdEmpty: () => {
          if (typeof callback === "function") callback(false); // false = not rewarded
        },
        onAdReady: () => {}
      });
    } else {
      if (typeof callback === "function") callback(false);
    }
  };
})(window);
/*
// Show interstitial ad break
GVAdBreak(function() {
  // Resume game here
});

// Show rewarded ad break (optional)
GVRewardedBreak(function(rewarded) {
  if (rewarded) {
    // Grant reward
  } else {
    // No reward
  }
});

*/