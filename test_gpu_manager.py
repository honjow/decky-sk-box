#!/usr/bin/env python3
"""
Test script for GPU Manager module
"""

import os
import sys
import logging

# Add py_modules to path
sys.path.insert(0, 'py_modules')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def test_gpu_manager():
    """Test GPU Manager functionality"""
    try:
        from gpu_manager import GpuManager
        
        # Test with current user home
        user_home = os.path.expanduser("~")
        print(f"Testing with user home: {user_home}")
        
        # Initialize GPU manager
        gpu_manager = GpuManager(user_home)
        print("GPU Manager initialized successfully")
        
        # Test getting GPU devices
        print("\n--- Testing GPU Device Detection ---")
        gpu_devices = gpu_manager.get_gpu_devices()
        print(f"Found {len(gpu_devices)} GPU devices:")
        for i, device in enumerate(gpu_devices):
            print(f"  {i+1}. {device['name']} [{device['vendorLabel']}] (ID: {device['id']})")
        
        # Test getting current Vulkan adapter
        print("\n--- Testing Current Vulkan Adapter ---")
        current_adapter = gpu_manager.get_current_vulkan_adapter()
        print(f"Current VULKAN_ADAPTER: {current_adapter if current_adapter else 'Not set'}")
        
        # Test setting Vulkan adapter (if devices found)
        if gpu_devices:
            print("\n--- Testing Vulkan Adapter Setting ---")
            test_device_id = gpu_devices[0]['id']
            print(f"Setting VULKAN_ADAPTER to: {test_device_id}")
            
            success = gpu_manager.set_vulkan_adapter(test_device_id)
            print(f"Set operation result: {success}")
            
            # Verify the setting
            new_adapter = gpu_manager.get_current_vulkan_adapter()
            print(f"New VULKAN_ADAPTER: {new_adapter}")
            
            # Test clearing the setting
            print("\n--- Testing Vulkan Adapter Clearing ---")
            success = gpu_manager.set_vulkan_adapter("")
            print(f"Clear operation result: {success}")
            
            # Verify the clearing
            cleared_adapter = gpu_manager.get_current_vulkan_adapter()
            print(f"Cleared VULKAN_ADAPTER: {cleared_adapter if cleared_adapter else 'Not set'}")
        
        print("\n--- Test Completed Successfully ---")
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("Make sure you're running this from the project root directory")
    except Exception as e:
        print(f"Test failed with error: {e}")
        logging.exception("Test error details:")

if __name__ == "__main__":
    test_gpu_manager()
