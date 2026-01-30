import Capacitor
import AppTrackingTransparencyPlugin
import RevenuecatPurchasesCapacitor

@objc(MyViewController)
class MyViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 手動でプラグインを登録
        // ATT (App Tracking Transparency)
        bridge?.registerPluginInstance(AppTrackingTransparencyPlugin())
        
        // RevenueCat (In-App Purchases)
        bridge?.registerPluginInstance(PurchasesPlugin())
    }
}
