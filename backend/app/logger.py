from loguru import logger
import sys

# Configure logger to write to rotating file and stdout
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("backend/logs/app_{time}.log", rotation="10 MB", level="DEBUG", enqueue=True)
