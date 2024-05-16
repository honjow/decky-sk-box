from enum import Enum


class SleepMode(Enum):
    SUSPEND = "suspend"
    HIBERNATE = "hibernate"
    SUSPEND_THEN_HIBERNATE = "suspend-then-hibernate"
