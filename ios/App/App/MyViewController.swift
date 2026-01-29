import Foundation
import Capacitor

class MyViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        
        // Capacitor 7/8では自動登録されるため、手動登録は不要
        // プラグインはPackage.swiftで管理される
        print("[MyViewController] Capacitor loaded successfully")
    }
}
