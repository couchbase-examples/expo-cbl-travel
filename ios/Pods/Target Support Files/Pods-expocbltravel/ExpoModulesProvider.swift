/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

import ExpoModulesCore
import ExpoAsset
import EXConstants
import ExpoFileSystem
import ExpoFont
import ExpoKeepAwake
import ExpoHead
import ExpoSystemUI
import ExpoWebBrowser
#if EXPO_CONFIGURATION_DEBUG
import EXDevLauncher
import EXDevMenu
#endif

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      AssetModule.self,
      ConstantsModule.self,
      FileSystemModule.self,
      FontLoaderModule.self,
      KeepAwakeModule.self,
      ExpoHeadModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self,
      DevLauncherInternal.self,
      DevLauncherAuth.self,
      RNCSafeAreaProviderManager.self,
      DevMenuModule.self,
      DevMenuInternalModule.self,
      DevMenuPreferences.self,
      RNCSafeAreaProviderManager.self
    ]
    #else
    return [
      AssetModule.self,
      ConstantsModule.self,
      FileSystemModule.self,
      FontLoaderModule.self,
      KeepAwakeModule.self,
      ExpoHeadModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self
    ]
    #endif
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      FileSystemBackgroundSessionHandler.self,
      ExpoHeadAppDelegateSubscriber.self,
      ExpoDevLauncherAppDelegateSubscriber.self
    ]
    #else
    return [
      FileSystemBackgroundSessionHandler.self,
      ExpoHeadAppDelegateSubscriber.self
    ]
    #endif
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      (packageName: "expo-dev-launcher", handler: ExpoDevLauncherReactDelegateHandler.self),
      (packageName: "expo-dev-menu", handler: ExpoDevMenuReactDelegateHandler.self)
    ]
    #else
    return [
    ]
    #endif
  }
}
