from enum import Enum

class LoanStatusCode(Enum):
    ACTIVE = "ACT"
    RETURNED = "DEV"
    OVERDUE = "VENC"
