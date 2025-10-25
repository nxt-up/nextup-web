# Deep Linking Setup for Next Up iOS App

This document outlines the steps needed to configure Universal Links (deep linking) between the Next Up website and the iOS app.

## Overview

Universal Links allow users to tap a link to your website and open your content directly in your app (if installed) without going through Safari. The website has been configured to support deep linking for:

- Show pages: `https://yourdomain.com/show/{showId}`
- Episode pages: `https://yourdomain.com/show/{showId}/season/{seasonNum}/episode/{episodeNum}`
- User profiles: `https://yourdomain.com/user/{userId}`

## Website Configuration (Already Complete)

✅ **AASA File**: Located at `public/.well-known/apple-app-site-association`
✅ **Vercel Config**: Configured to serve AASA with correct Content-Type header
✅ **Deep Link Buttons**: All pages include "Open in Next Up" buttons with `nextup://` scheme

## iOS App Configuration (Required Steps)

### Step 1: Add Associated Domains Capability

1. Open your iOS project in Xcode:

   ```
   /Users/patdugan/Documents/GitHub/next-up-app/NextUp/NextUp.xcodeproj
   ```

2. Select your app target in Xcode

3. Go to **Signing & Capabilities** tab

4. Click **+ Capability** button

5. Add **Associated Domains**

6. Add your domain with the `applinks:` prefix:
   ```
   applinks:yourdomain.com
   ```
   **Important**: Replace `yourdomain.com` with your actual domain (e.g., `nextup.app`)

### Step 2: Update Apple Developer Account

1. Sign in to [developer.apple.com](https://developer.apple.com)

2. Navigate to **Certificates, Identifiers & Profiles**

3. Select **Identifiers** → Find your app identifier (`app.nextup`)

4. Enable **Associated Domains** capability

5. Click **Save**

6. **Download and reinstall your provisioning profiles** if needed

### Step 3: Update Deep Link Handling Code

Update your `DeepLinkServiceProtocol.swift` file (or create new handling) to support universal links:

#### Location:

```
/Users/patdugan/Documents/GitHub/next-up-app/NextUp/NextUp/Utilities/DeepLinkServiceProtocol.swift
```

#### Add Universal Link Handling:

```swift
import SwiftUI

// Add to your App struct
@main
struct NextUpApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    handleUniversalLink(url)
                }
        }
    }

    func handleUniversalLink(_ url: URL) {
        // Parse the URL
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true) else {
            return
        }

        let pathComponents = components.path.split(separator: "/").map(String.init)

        // Handle show links: /show/{showId}
        if pathComponents.first == "show", pathComponents.count >= 2 {
            let showId = pathComponents[1]

            // Check for episode link: /show/{showId}/season/{num}/episode/{num}
            if pathComponents.count == 6,
               pathComponents[2] == "season",
               pathComponents[4] == "episode" {
                let seasonNum = pathComponents[3]
                let episodeNum = pathComponents[5]
                navigateToEpisode(showId: showId, season: seasonNum, episode: episodeNum)
            } else {
                navigateToShow(showId: showId)
            }
        }

        // Handle user profile links: /user/{userId}
        else if pathComponents.first == "user", pathComponents.count >= 2 {
            let userId = pathComponents[1]
            navigateToUserProfile(userId: userId)
        }
    }

    func navigateToShow(showId: String) {
        // Your navigation logic here
        // Example: coordinator.navigate(to: .showDetail(id: showId))
    }

    func navigateToEpisode(showId: String, season: String, episode: String) {
        // Your navigation logic here
    }

    func navigateToUserProfile(userId: String) {
        // Your navigation logic here
    }
}
```

### Step 4: Test Universal Links

#### On Simulator (Limited Testing):

Simulators don't validate AASA files, but you can test URL parsing logic.

#### On Physical Device (Required for Full Testing):

1. **Deploy website to production** with your custom domain
2. Wait 24 hours for Apple's CDN to cache your AASA file
3. **Test the link**:
   - Send yourself a link via Messages or Notes
   - Tap the link (don't long-press)
   - Your app should open automatically

#### Validate AASA File:

Use Apple's validator or command line:

```bash
curl -v https://yourdomain.com/.well-known/apple-app-site-association
```

Verify:

- HTTP 200 response
- Content-Type: `application/json`
- No redirects
- HTTPS required

### Step 5: Fallback Handling

The app should also handle the custom `nextup://` URL scheme for backward compatibility:

1. In Xcode, go to **Info** tab
2. Under **URL Types**, add:
   - **Identifier**: `app.nextup`
   - **URL Schemes**: `nextup`

This allows links like `nextup://show/12345` to work even if universal links fail.

## URL Patterns Supported

| Pattern                                 | Example                                            | Purpose               |
| --------------------------------------- | -------------------------------------------------- | --------------------- |
| `/show/{showId}`                        | `https://nextup.app/show/12345`                    | Open show details     |
| `/show/{showId}/season/{s}/episode/{e}` | `https://nextup.app/show/12345/season/1/episode/1` | Open specific episode |
| `/user/{userId}`                        | `https://nextup.app/user/abc123`                   | Open user profile     |

## Troubleshooting

### Links Not Opening in App

1. **Check domain configuration**: Ensure domain matches exactly in:
   - AASA file (`appID`)
   - Xcode Associated Domains
   - Website deployment

2. **Verify AASA file is accessible**:

   ```bash
   curl https://yourdomain.com/.well-known/apple-app-site-association
   ```

3. **Clear AASA cache** on device:
   - Uninstall app
   - Restart device
   - Reinstall app
   - Wait a few minutes

4. **Check Xcode console** for errors when tapping links

### App Opens Safari Instead

- This usually means AASA validation failed
- Verify your Team ID matches: `2DS67Q47ES`
- Verify your Bundle ID matches: `app.nextup`
- Check for typos in domain name

## Resources

- [Apple Universal Links Documentation](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [AASA Validator](https://search.developer.apple.com/appsearch-validation-tool/)
- [Next Up iOS Project](file:///Users/patdugan/Documents/GitHub/next-up-app/NextUp)

## Next Steps

After configuring universal links:

1. ✅ Test on physical device
2. ✅ Update App Store listing with website URL
3. ✅ Add universal link support to marketing materials
4. ✅ Monitor analytics for deep link usage

---

**Questions or Issues?**
Refer to the main project README or check Apple's documentation.
