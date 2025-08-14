import os
import subprocess
import re
import logging
import decky
import pwd
from typing import List, Dict


class GpuManager:
    def __init__(self, user_home: str):
        """Initialize GPU Manager with user home directory"""
        self.user_home = user_home
        self.env_dir = os.path.join(user_home, ".config", "environment.d")
        self.env_file = os.path.join(self.env_dir, "00-vulkan-device.conf")
        
        # 使用Decky变量获取用户信息
        self.decky_user = decky.DECKY_USER
        self.decky_user_home = decky.DECKY_USER_HOME
        
        logging.info(f"GPU Manager initialized with user_home: {user_home}")
        logging.info(f"Decky user: {self.decky_user}, Decky user home: {self.decky_user_home}")

    def get_gpu_devices(self) -> List[Dict[str, str]]:
        """Get available GPU devices from system"""
        try:
            logging.info("Starting GPU device detection...")
            
            result = subprocess.run(
                ["lspci", "-vnn"], 
                capture_output=True, 
                text=True, 
                check=True
            )
            
            gpu_devices = []
            for line in result.stdout.split('\n'):
                if any(keyword in line for keyword in ["VGA compatible", "3D controller", "Display controller"]):
                    device_id_match = re.search(r'\[([0-9a-f]{4}:[0-9a-f]{4})\]', line)
                    if device_id_match:
                        device_id = device_id_match.group(1)
                        device_name = self._extract_device_name(line)
                        vendor_id = device_id.split(':')[0]
                        
                        gpu_devices.append({
                            "id": device_id,
                            "name": device_name,
                            "vendor": vendor_id,
                            "vendorLabel": self._get_vendor_label(vendor_id)
                        })
            
            logging.info(f"GPU detection completed. Found {len(gpu_devices)} devices")
            return gpu_devices
            
        except Exception as e:
            logging.error(f"Error getting GPU devices: {e}", exc_info=True)
            return []

    def set_vulkan_adapter(self, device_id: str) -> bool:
        """Set or clear VULKAN_ADAPTER environment variable"""
        try:
            os.makedirs(self.env_dir, exist_ok=True)
            
            # Read existing content
            existing_content = ""
            if os.path.exists(self.env_file):
                with open(self.env_file, 'r') as f:
                    existing_content = f.read()
            
            # Build new content
            lines = existing_content.split('\n') if existing_content else []
            new_lines = [line for line in lines if not line.startswith("VULKAN_ADAPTER=")]
            
            if device_id:
                new_lines.append(f"VULKAN_ADAPTER={device_id}")
            
            # Write to file
            if new_lines:
                with open(self.env_file, 'w') as f:
                    f.write('\n'.join(new_lines) + '\n')
                
                # 获取Decky用户的UID和GID
                decky_user_info = pwd.getpwnam(self.decky_user)
                
                # 修改文件所有者为Decky用户
                os.chown(self.env_file, decky_user_info.pw_uid, decky_user_info.pw_gid)
                # 设置文件权限为644
                os.chmod(self.env_file, 0o644)
                
                logging.info(f"File permissions updated: owner={self.decky_user}, permissions=644")
            else:
                # If no content, remove the file entirely
                if os.path.exists(self.env_file):
                    os.remove(self.env_file)
            
            logging.info(f"VULKAN_ADAPTER {'set to ' + device_id if device_id else 'cleared'}")
            return True
            
        except Exception as e:
            logging.error(f"Error setting VULKAN_ADAPTER: {e}", exc_info=True)
            return False

    def get_current_vulkan_adapter(self) -> str:
        """Get currently set VULKAN_ADAPTER value"""
        try:
            if not os.path.exists(self.env_file):
                return ""
            
            with open(self.env_file, 'r') as f:
                for line in f:
                    if line.startswith("VULKAN_ADAPTER="):
                        return line.split('=')[1].strip()
            return ""
            
        except Exception as e:
            logging.error(f"Error getting current VULKAN_ADAPTER: {e}", exc_info=True)
            return ""

    def _extract_device_name(self, line: str) -> str:
        """Extract and clean device name from lspci output"""
        # Extract everything after ': ' and before device ID
        device_name = line.split(': ')[-1]
        device_name = re.sub(r' \[[0-9a-f]{4}:[0-9a-f]{4}\].*$', '', device_name)
        
        # Remove vendor prefixes
        vendor_prefixes = [
            r'^Advanced Micro Devices, Inc\. \[AMD/ATI\] ',
            r'^Intel Corporation ',
            r'^NVIDIA Corporation '
        ]
        
        for prefix in vendor_prefixes:
            device_name = re.sub(prefix, '', device_name)
        
        return device_name

    def _get_vendor_label(self, vendor_id: str) -> str:
        """Get vendor label from vendor ID"""
        vendor_map = {"1002": "AMD", "8086": "Intel", "10de": "NVIDIA"}
        return vendor_map.get(vendor_id, vendor_id)
